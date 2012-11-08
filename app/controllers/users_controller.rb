class UsersController < ApplicationController
  before_filter :sign_in_required, :only => [:show]

  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new

    render :layout => "application_login"
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      sign_in @user
      flash[:success] = "Welcome to the Sample App!"
      redirect_to @user
    else
      render 'new'
    end
  end
end

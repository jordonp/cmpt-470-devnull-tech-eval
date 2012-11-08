class DemoController < ApplicationController
  def index
    if !signed_in?
        render :layout => "application_login"
    end
  end

  def show
    @demo = params[:id]
    if !signed_in?
        layout = "application_login"
    else
        layout = "application"
    end
    respond_to do |format|
      format.html {
        case @demo
        when "1"
            render :layout => layout, :action => "demo_1"
        when "2"
            render :layout => layout, :action => "demo_2"
        when "3"
            render :layout => layout, :action => "demo_3"
        else
            render :layout => layout, :action => "demo_1"
        end
      }
    end
  end

  def demo_1
  end

  def demo_2
  end

  def demo_3
  end
end
